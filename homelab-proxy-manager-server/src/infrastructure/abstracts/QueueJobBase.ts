import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";


export abstract class QueueJobBase<I, O> {
  private queue: queueAsPromised<I>;

  protected abstract handle(job: I): Promise<O>;

  public constructor() {
    this.queue = fastq.promise(this, this.handle, 1);
  }

  public async dispatch(data: I): Promise<O> {
    return await this.queue.push(data);
  }
}
