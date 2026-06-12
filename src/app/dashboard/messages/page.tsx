export const dynamic = "force-dynamic";

import { MessagesManager } from "@/components/dashboard/messages-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getMessages } from "@/lib/data/store";

export default async function MessagesDashboardPage() {
  const messages = await getMessages();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Pesan Masuk"
        description="Lihat dan kelola pesan dari pengunjung website"
      />
      <MessagesManager initialMessages={messages} />
    </>
  );
}
