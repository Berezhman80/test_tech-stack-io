export type Gender = 0 | 1 | 2;

export default class UserResponseDto {
  id: string;
  name: string;
  yearOfBirth: number;
  gender: Gender;
  created: string;
  profileImage: string | null;
}
