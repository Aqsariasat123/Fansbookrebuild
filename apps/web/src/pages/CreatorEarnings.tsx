import IncomeSection from '../components/creator-wallet/IncomeSection';

/**
 * Standalone "My Earning" page. Body delegated to the shared IncomeSection,
 * which is also reused inside the creator's Wallet → Income tab.
 */
export default function CreatorEarnings() {
  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-foreground">My Earning</p>
      <IncomeSection />
    </div>
  );
}
