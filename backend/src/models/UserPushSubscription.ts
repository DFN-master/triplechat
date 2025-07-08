import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo
} from "sequelize-typescript";
import User from "./User";
import Company from "./Company";

@Table
class UserPushSubscription extends Model<UserPushSubscription> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @Column(DataType.TEXT)
  endpoint: string;

  @Column(DataType.STRING)
  expirationTime: string | null;

  @Column(DataType.TEXT)
  keys_p256dh: string;

  @Column(DataType.TEXT)
  keys_auth: string;

  @Column(DataType.STRING)
  browser: string; // opcional: ajuda em debug (chrome/firefox)

  @Column(DataType.STRING)
  platform: string; // opcional: mobile/desktop

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserPushSubscription;
