class TimeService {
    constructor() {
        this.offset = 0;
        this.isSynced = false;
        this.syncPromise = null;
    }

    async sync() {
        if (this.syncPromise) return this.syncPromise;

        this.syncPromise = (async () => {
            try {
                console.log('Syncing time...');
                const start = Date.now();
                const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
                const data = await response.json();
                const end = Date.now();
                const latency = (end - start) / 2;

                // worldtimeapi returns datetime with offset
                const serverTime = new Date(data.datetime).getTime();

                // Calculate offset: Server Time - (Local Time at moment of server time)
                // Local Time at moment of server time ~= Date.now() - latency
                this.offset = serverTime - (Date.now() - latency);
                this.isSynced = true;
                console.log('Time synced. Offset (ms):', this.offset);
            } catch (error) {
                console.warn('Failed to sync time (using local time):', error.message);
                // Fallback to local time (offset 0)
            } finally {
                this.syncPromise = null;
            }
        })();

        return this.syncPromise;
    }

    getNow() {
        return new Date(Date.now() + this.offset);
    }
}

export const timeService = new TimeService();
