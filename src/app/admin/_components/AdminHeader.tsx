import AdminSignOut from "./AdminSignOut";
import styles from "../admin.module.css";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <header className={styles.adminHeader}>
      <div className={styles.adminHeaderLeft}>
        <span className={styles.adminHeaderTitle}>Admin Portal</span>
      </div>

      <div className={styles.adminHeaderRight}>
        <span className={styles.adminRoleBadge}>Admin</span>
        <span className={styles.adminUserName}>{user?.name}</span>
        <div className={styles.adminAvatar}>
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || "Admin"}
              className={styles.adminAvatarImg}
            />
          ) : (
            initial
          )}
        </div>
        <AdminSignOut />
      </div>
    </header>
  );
}

