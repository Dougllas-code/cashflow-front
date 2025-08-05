export interface UtcDateProvider {
  getTodayDate(): Date;
  getTodayDateTime(): Date;
}

export const UTC_DATE_PROVIDER: UtcDateProvider = {
  getTodayDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  },
  getTodayDateTime(): Date {
    return new Date();
  }
};