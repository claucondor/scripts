import { OldWav3s } from "../../entities/migration/oldWav3s";
import { NewWav3 } from "../../entities/migration/newWav3s";
import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";
import { Profile } from "../../entities/profile";

export interface IMigrationRepository {
  getOldWav3s(collection: string): Promise<OldWav3s[]>;
  createNewWav3s(env: boolean, wav3s: NewWav3[]): Promise<void>;
  getProfile(filters: GetProfileByFiltersDto): Promise<Profile | undefined>;
}
