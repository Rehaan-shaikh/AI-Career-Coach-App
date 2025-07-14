import { getCoverLetter } from '@/actions/cover-letter'
import React from 'react'
import CoverLetterPreview from '../_componets/cover-letter-preview';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CoverLetterPreviewPage = async ({params}) => {
  const {id} = await params 
  const letter = await getCoverLetter(id);
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {letter?.jobTitle} at {letter?.companyName}
        </h1>
      </div>
      <CoverLetterPreview letter={letter} />
    </div>
  )
}

export default CoverLetterPreviewPage
