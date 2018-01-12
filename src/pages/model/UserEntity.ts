export interface UserEntity {
  id: number;
  userName: string;
  password: string;
  userSex: string;
  nickName: string;

  // not persist
  cellNumber: number;
  isSelected: boolean;
}
