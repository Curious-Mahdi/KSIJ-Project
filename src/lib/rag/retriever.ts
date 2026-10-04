import { prisma } from "@/lib/prisma";

export interface RetrievedChunk {
  id: string;
  documentId: string;
  title: string;
  content: string;
  section: string | null;
  pageNumber: number | null;
  similarity: number;
  sourceUrl?: string;
}

export async function retrieveRelevantChunks(
  query: string,
  limit: number = 8,
  threshold: number = 0.1
): Promise<RetrievedChunk[]> {
  const queryLower = query.toLowerCase();
  const searchTerms = queryLower
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((w) => w.length > 2);

  const chunks: RetrievedChunk[] = [];

  // 1. Fetch live Services
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
    });

    for (const s of services) {
      let score = 0;
      const textToSearch = [
        s.title,
        s.category,
        s.description,
        s.eligibility || "",
        s.requiredDocuments || "",
        s.process || "",
        s.faqs || "",
      ]
        .join(" ")
        .toLowerCase();

      // Simple keyword relevance scoring
      for (const term of searchTerms) {
        if (s.title.toLowerCase().includes(term)) score += 3;
        else if (s.category.toLowerCase().includes(term)) score += 2;
        else if (textToSearch.includes(term)) score += 1;
      }

      // If general query like "services" or specific match
      if (queryLower.includes("service") || queryLower.includes("scheme")) {
        score += 1;
      }

      if (score > 0 || searchTerms.length === 0) {
        let content = `${s.description}`;
        if (s.eligibility) content += `\nEligibility: ${s.eligibility}`;
        if (s.requiredDocuments) content += `\nRequired Documents: ${s.requiredDocuments}`;
        if (s.process) content += `\nProcedure: ${s.process}`;
        if (s.faqs) content += `\nFAQs: ${s.faqs}`;
        if (s.contactInfo) content += `\nContact: ${s.contactInfo}`;

        chunks.push({
          id: `service-${s.id}`,
          documentId: s.id,
          title: `${s.title} (${s.category} Service)`,
          content,
          section: s.category,
          pageNumber: null,
          similarity: Math.min(score * 0.2, 1.0),
          sourceUrl: "/services",
        });
      }
    }
  } catch (err) {
    console.error("Error retrieving services for RAG:", err);
  }

  // 2. Fetch live Events
  try {
    const events = await prisma.event.findMany({
      where: { status: { in: ["UPCOMING", "ONGOING"] } },
    });

    for (const e of events) {
      let score = 0;
      const eventDateStr = new Date(e.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const textToSearch = [e.title, e.description, e.location, e.time, eventDateStr]
        .join(" ")
        .toLowerCase();

      for (const term of searchTerms) {
        if (e.title.toLowerCase().includes(term)) score += 3;
        else if (e.location.toLowerCase().includes(term)) score += 2;
        else if (textToSearch.includes(term)) score += 1;
      }

      if (queryLower.includes("event") || queryLower.includes("program") || queryLower.includes("camp")) {
        score += 1;
      }

      if (score > 0) {
        const content = `Date: ${eventDateStr}\nTime: ${e.time}\nLocation: ${e.location}\nDetails: ${e.description}${
          e.registrationUrl ? `\nRegistration URL: ${e.registrationUrl}` : ""
        }`;

        chunks.push({
          id: `event-${e.id}`,
          documentId: e.id,
          title: `${e.title} (Event)`,
          content,
          section: "Events & Announcements",
          pageNumber: null,
          similarity: Math.min(score * 0.2, 1.0),
          sourceUrl: "/events",
        });
      }
    }
  } catch (err) {
    console.error("Error retrieving events for RAG:", err);
  }

  // 3. Fetch live Facilities
  try {
    const facilities = await prisma.facility.findMany({
      where: { isAvailable: true },
    });

    for (const f of facilities) {
      let score = 0;
      const textToSearch = [f.name, f.description, f.location, f.amenities || "", f.rules || ""]
        .join(" ")
        .toLowerCase();

      for (const term of searchTerms) {
        if (f.name.toLowerCase().includes(term)) score += 3;
        else if (f.location.toLowerCase().includes(term)) score += 2;
        else if (textToSearch.includes(term)) score += 1;
      }

      if (queryLower.includes("hall") || queryLower.includes("facility") || queryLower.includes("venue") || queryLower.includes("book")) {
        score += 1;
      }

      if (score > 0) {
        const content = `Location: ${f.location}\nCapacity: ${f.capacity} guests\nAmenities: ${f.amenities || "Standard"}\nDescription: ${f.description}${
          f.rules ? `\nRules: ${f.rules}` : ""
        }${f.contactInfo ? `\nContact: ${f.contactInfo}` : ""}`;

        chunks.push({
          id: `facility-${f.id}`,
          documentId: f.id,
          title: `${f.name} (Facility Venue)`,
          content,
          section: "Community Facilities",
          pageNumber: null,
          similarity: Math.min(score * 0.2, 1.0),
          sourceUrl: "/facilities",
        });
      }
    }
  } catch (err) {
    console.error("Error retrieving facilities for RAG:", err);
  }

  // 4. Fetch live Announcements
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
    });

    for (const a of announcements) {
      let score = 0;
      const textToSearch = [a.title, a.content, a.category].join(" ").toLowerCase();

      for (const term of searchTerms) {
        if (a.title.toLowerCase().includes(term)) score += 3;
        else if (textToSearch.includes(term)) score += 1;
      }

      if (queryLower.includes("announcement") || queryLower.includes("update") || queryLower.includes("notice")) {
        score += 1;
      }

      if (score > 0) {
        chunks.push({
          id: `announcement-${a.id}`,
          documentId: a.id,
          title: `${a.title} (Update)`,
          content: `${a.content}${a.linkUrl ? `\nLink: ${a.linkUrl}` : ""}`,
          section: a.category,
          pageNumber: null,
          similarity: Math.min(score * 0.2, 1.0),
          sourceUrl: "/updates",
        });
      }
    }
  } catch (err) {
    console.error("Error retrieving announcements for RAG:", err);
  }

  // 5. Query existing Knowledge Documents / Chunks if any
  try {
    const docs = await prisma.knowledgeDocument.findMany({
      where: { status: "active" },
      include: { chunks: true },
    });

    for (const d of docs) {
      for (const c of d.chunks) {
        let score = 0;
        const textToSearch = [d.title, c.content, c.section || ""].join(" ").toLowerCase();

        for (const term of searchTerms) {
          if (d.title.toLowerCase().includes(term)) score += 3;
          else if (textToSearch.includes(term)) score += 1;
        }

        if (score > 0) {
          chunks.push({
            id: c.id,
            documentId: d.id,
            title: d.title,
            content: c.content,
            section: c.section,
            pageNumber: c.pageNumber,
            similarity: Math.min(score * 0.2, 1.0),
            sourceUrl: `/library/${d.id}`,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error retrieving knowledge documents for RAG:", err);
  }

  // Sort descending by similarity score
  chunks.sort((a, b) => b.similarity - a.similarity);

  return chunks.slice(0, limit);
}
