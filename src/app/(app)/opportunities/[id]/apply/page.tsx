import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "../../post/page.module.css"; // Reuse post styles
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function submitApplication(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) throw new Error("User not found");

  const opportunityId = formData.get("opportunityId") as string;
  const coverMessage = formData.get("coverMessage") as string;

  await prisma.opportunityApplication.create({
    data: {
      opportunityId,
      userId: user.id,
      coverMessage,
      status: "SUBMITTED"
    }
  });

  redirect(`/opportunities/my?tab=applied`);
}

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?callbackUrl=/opportunities/${resolvedParams.id}/apply`);
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!opportunity) notFound();

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href={`/opportunities/${opportunity.id}`} className={styles.backLink}>
          <ArrowLeft size={16} /> Back to opportunity
        </Link>

        <h1 className={styles.title}>Apply for {opportunity.title}</h1>
        <p className={styles.subtitle}>
          Applying to {opportunity.organisationName}. Your KSIJ One profile details will be shared.
        </p>

        <form action={submitApplication} className={styles.formCard}>
          <input type="hidden" name="opportunityId" value={opportunity.id} />
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input type="text" className={styles.input} value={session.user.name || ""} disabled />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input type="email" className={styles.input} value={session.user.email || ""} disabled />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Why are you interested in this opportunity? (Optional)</label>
            <textarea name="coverMessage" className={styles.textarea} placeholder="Write a short message to the poster..."></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
