class TimeService {
    constructor() {
        this.offset = 0;
        this.isSynced = false;
        this.syncPromise = null;
    }

    async sync() {
        if (this.syncPromise) return this.syncPromise;

        this.syncPromise = (async () => {
            let serverTime = null;
            let latency = 0;

            // Strategy 1: WorldTimeAPI
            try {
                console.log('Syncing time (Primary: worldtimeapi)...');
                const start = Date.now();
                const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
                if (!response.ok) throw new Error(`Status ${response.status}`);
                const data = await response.json();
                const end = Date.now();
                latency = (end - start) / 2;
                serverTime = new Date(data.datetime).getTime();
            } catch (error) {
                console.warn('Primary time sync failed:', error.message);
            }

            // Strategy 2: TimeAPI.io (Backup)
            if (!serverTime) {
                try {
                    console.log('Syncing time (Backup: timeapi.io)...');
                    const start = Date.now();
                    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo');
                    if (!response.ok) throw new Error(`Status ${response.status}`);
                    const data = await response.json();
                    const end = Date.now();
                    latency = (end - start) / 2;
                    // timeapi.io returns "dateTime": "2023-10-27T10:00:00.1234567"
                    serverTime = new Date(data.dateTime).getTime();
                } catch (error) {
                    console.warn('Backup time sync failed:', error.message);
                }
            }

            if (serverTime) {
                // Calculate offset: Server Time - (Local Time at moment of server time)
                // Local Time at moment of server time ~= Date.now() - latency
                this.offset = serverTime - (Date.now() - latency);
                this.isSynced = true;
                console.log('Time synced. Offset (ms):', this.offset);
            } else {
                console.warn('All time sync attempts failed. Using local time.');
                this.offset = 0;
                // We don't set isSynced to true if we want to try again later, 
                // but for now let's treat local time as "synced enough" to avoid loops
                this.isSynced = true;
            }

            this.syncPromise = null;
        })();

        return this.syncPromise;
    }

    getNow() {
        return new Date(Date.now() + this.offset);
    }
}

export const timeService = new TimeService();
