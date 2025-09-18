export interface DateProvider {
  getTodayDate(): Date;
}

export const DATE_PROVIDER: DateProvider = {
  getTodayDate(): Date {
    return new Date();
  },
};