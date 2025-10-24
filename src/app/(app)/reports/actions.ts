'use server';

import {
  generateReportSuggestions,
  type GenerateReportSuggestionsInput,
} from '@/ai/flows/generate-report-suggestions';
import { addDocumentNonBlocking } from '@/firebase';
import { Campaign } from '@/lib/types';
import { collection, getFirestore } from 'firebase/firestore';

export async function getReportSuggestionsAction(
  campaigns: Campaign[]
) {
  try {
    const input: GenerateReportSuggestionsInput = { campaigns };
    const result = await generateReportSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate suggestions.' };
  }
}

export async function generateReportAction(userId: string, campaignIds: string[]) {
    try {
        const firestore = getFirestore();
        const reportsCollection = collection(firestore, `users/${userId}/reports`);
        
        await addDocumentNonBlocking(reportsCollection, {
            userId,
            campaignIds,
            generatedAt: new Date().toISOString(),
        });

        return { success: true };
    } catch(error) {
        console.error(error);
        return { success: false, error: 'Failed to generate report.' };
    }
}
