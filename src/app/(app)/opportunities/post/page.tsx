import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

async function createOpportunity(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/opportunities/post");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) throw new Error("User not found");

  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const organisationName = formData.get("organisationName") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const skills = formData.get("skills") as string;
  const location = formData.get("location") as string;
  const workMode = formData.get("workMode") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  const applicationMethod = formData.get("applicationMethod") as string;
  const externalApplicationUrl = formData.get("externalApplicationUrl") as string;

  await prisma.opportunity.create({
    data: {
      type,
      title,
      organisationName,
      description,
      category,
      skills,
      location,
      workMode,
      experienceLevel,
      applicationMethod,
      externalApplicationUrl,
      postedByUserId: user.id,
      status: "PUBLISHED"
    }
  });

  redirect("/opportunities/my?success=true");
}

export default async function PostOpportunityPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/opportunities/post");
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href="/opportunities" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to opportunities
        </Link>

        <h1 className={styles.title}>Post an Opportunity</h1>
        <p className={styles.subtitle}>
          Share a job, internship, mentorship, project, or volunteering opportunity with the KSIJ community.
        </p>

        <form action={createOpportunity} className={styles.formCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Opportunity Type *</label>
            <select name="type" className={styles.select} required>
              <option value="JOB">Job</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="MENTORSHIP">Mentorship</option>
              <option value="PROJECT">Community Project</option>
              <option value="VOLUNTEERING">Volunteering</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title *</label>
            <input type="text" name="title" className={styles.input} required placeholder="e.g. Frontend Developer Intern" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Organisation / Person *</label>
            <input type="text" name="organisationName" className={styles.input} required placeholder="e.g. PixelCraft Digital" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea name="description" className={styles.textarea} required placeholder="Describe the opportunity, responsibilities, and expectations..."></textarea>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Skills (Optional)</label>
            <span className={styles.hint}>Comma separated (e.g. React, Next.js, Design)</span>
            <input type="text" name="skills" className={styles.input} placeholder="React, Figma, Communication" />
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select name="category" className={styles.select}>
                <option value="Technology & Digital">Technology & Digital</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input type="text" name="location" className={styles.input} placeholder="e.g. Mumbai" />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Work Mode</label>
              <select name="workMode" className={styles.select}>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Experience Level</label>
              <select name="experienceLevel" className={styles.select}>
                <option value="Student">Student</option>
                <option value="Fresher">Fresher</option>
                <option value="0-2 years">0–2 years</option>
                <option value="2-5 years">2–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>How should people apply?</label>
            <select name="applicationMethod" className={styles.select} required>
              <option value="KSIJ_ONE">Apply through KSIJ One</option>
              <option value="EXTERNAL">External Application Link</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>External Application URL (if applicable)</label>
            <input type="url" name="externalApplicationUrl" className={styles.input} placeholder="https://" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Review & Publish
          </button>
        </form>
      </div>
    </div>
  );
}
