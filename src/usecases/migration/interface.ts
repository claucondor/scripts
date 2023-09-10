export interface IMigrationUseCase {
  oldWav3sToNewWav3s(env: boolean): Promise<void>;
  createPaymentsResume(env: boolean): Promise<void>;
}
