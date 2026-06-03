export interface SleepLog{
    id: string;
    startTime: string;
    endTime: string; 
    totalDuration: number;

    // Optional 
    rating: number | null;
    comment: string | null;

    // meta data
    createdAt: string; 
    updatedAt?: string;
}