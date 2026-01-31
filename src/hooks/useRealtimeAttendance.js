import { useEffect, useCallback } from 'react';
import { client } from '../lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '../services/appwriteService';

export function useRealtimeAttendance(onUpdate) {
  const handleRealtimeEvent = useCallback((response) => {
    if (response.events.includes(`databases.${DATABASE_ID}.collections.${COLLECTIONS.ATTENDANCE}.documents`)) {
      onUpdate(response.payload);
    }
  }, [onUpdate]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      [
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.ATTENDANCE}.documents`,
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.EMPLOYEES}.documents`
      ],
      handleRealtimeEvent
    );

    return () => {
      unsubscribe();
    };
  }, [handleRealtimeEvent]);
}
