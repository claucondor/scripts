import { OldWav3s } from "../../entities/migration/oldWav3s";
import { NewWav3 } from "../../entities/migration/newWav3s";
import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";
import { Profile } from "../../entities/profile";
import { PaymentDto } from "../../entities/migration/dto/payment-dto";
import { OldPaymentDto } from "../../entities/migration/dto/old-payments-dto";
import { NewPaymentDto } from "../../entities/migration/dto/new-payments-dto";

export interface IMigrationRepository {
  getOldWav3s(collection: string): Promise<OldWav3s[]>;
  createNewWav3s(env: boolean, wav3s: NewWav3[]): Promise<void>;
  getProfile(filters: GetProfileByFiltersDto): Promise<Profile | undefined>;
  createPayments(env: boolean, payments: PaymentDto[]): Promise<void>;
  getAllPayments(env: boolean): Promise<PaymentDto[]>;
  getAllOldPayments(): Promise<OldPaymentDto[]>;
  insertNewPayments(env: boolean, newPayments: NewPaymentDto[]): any;
}
