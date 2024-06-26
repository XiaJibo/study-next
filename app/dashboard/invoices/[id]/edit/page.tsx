import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import {Props} from "next/script";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const invoice = await fetchInvoiceById(id)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: invoice?.name + '-' + invoice?.amount,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    }
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  if (!invoice) {
    notFound();
  }
  return (
      <main>
        <Breadcrumbs
            breadcrumbs={[
              { label: 'Invoices', href: '/dashboard/invoices' },
              {
                label: 'Edit Invoice',
                href: `/dashboard/invoices/${id}/edit`,
                active: true,
              },
            ]}
        />
        <Form invoice={invoice} customers={customers} />
      </main>
  );
}
