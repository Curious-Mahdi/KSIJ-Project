import ListYourselfForm from "./ListYourselfForm";

export const metadata = {
  title: "List Yourself | KSIJ Reload Directory",
};

export default function ListYourselfPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
      <ListYourselfForm />
    </div>
  );
}
