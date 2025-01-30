export const STATUS = {
  WAIT_LOTTERY: 'WAIT_LOTTERY',
  RUNNING: 'RUNNING',
  COMPLETE: 'COMPLETE',
  
  status: 'WAIT_LOTTERY',
  
  getStatus() {
    return this.status;
  },
  
  setStatusWait() {
    this.status = this.WAIT_LOTTERY;
  },
  
  setStatusRun() {
    this.status = this.RUNNING;
  },
  
  setStatusComplete() {
    this.status = this.COMPLETE;
  }
}; 