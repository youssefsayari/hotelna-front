// activity-stats.model.ts
export interface ActivityStats {
    activitiesByType: Record<string, number>;
    participationByType: Record<string, number>;
    fullCapacityActivities: {
      count: number;
      activities: Array<{
        id: number;
        name: string;
        type: string;
        originalCapacity: number;
        participantsCount: number;
      }>;
    };
    mostPopularRecentType: string;
    recentParticipationCounts: Record<string, number>;
    uniqueUsersByType: Record<string, number>;
    totalActivities: number;
    totalParticipants: number;
    averageParticipationPerActivity: number;
  }