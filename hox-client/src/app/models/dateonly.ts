export class DateOnly {
  date: number;
  month: number;
  year: number;

  constructor(date) {

    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (typeof date === 'number') {
      date = this.numberToDate(date);
    }

    this.saveDateOnly(date || new Date());
  }

  saveDateOnly(date: Date): void {
    this.date = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  getDate(): number {
    return this.date;
  }

  setDate(date: number) {
    this.date = date;
  }

  getMonth(): number {
    return this.month;
  }

  setMonth(month: number) {
    this.month = month;
  }

  getFullYear(): number {
    return this.year;
  }

  setFullYear(year: number) {
    this.year = year;
  }

  getDay(): number {
    return this.toDate().getDay();
  }

  toDate(): Date {
    return this.partsToDate(this.year, this.month, this.date);
  }

  valueOf(): number {
    if(isNaN(this.year) || isNaN(this.month) || isNaN(this.date)) {
      return NaN;
    } else {

      // Concatenate with padding to preserve integer representation when
      // month or day is single digit.
      let string = this.year.toString() + this.month.toString().padStart(2, "0") + this.date.toString().padStart(2, "0");
      return parseInt(string);
    }
  }

  toString(): string {
    return this.toDate().toDateString();
  }

  toJSON(): number {
    return this.valueOf();
  }

  private numberToDate(number: number): Date {
    let string = number.toString();
    if (string.length == 8) {
      let year = +string.slice(0, 4);
      let month = +string.slice(4, 6);
      let day = +string.slice(6, 8);

      return this.partsToDate(year, month, day);
    } else {
      return new Date(number);
    }
  }

  private partsToDate(year: number, month: number, day: number): Date {
    let date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
