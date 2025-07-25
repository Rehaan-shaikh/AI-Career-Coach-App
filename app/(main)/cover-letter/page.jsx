import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterListing from "./_componets/cover-letter-listing";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();
  
  if (!coverLetters ) {
    return <p className="text-center py-10 text-muted">Please log in to view your cover letters.</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterListing coverLetters={coverLetters} />
    </div>
  );
}
