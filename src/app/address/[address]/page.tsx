import { notFound } from "next/navigation";
import { isAddress } from "viem";
import { AddressAnalysisView } from "@/components/address/address-analysis";

type AddressPageProps = {
  params: Promise<{ address: string }>;
};

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;
  if (!isAddress(address)) notFound();
  return <AddressAnalysisView address={address} />;
}
