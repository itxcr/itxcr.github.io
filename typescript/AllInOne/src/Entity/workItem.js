import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn()
  id
  @Column({ length: 100 })
  text

  @Column({ default: false })
  isChecked

  @CreateDateColumn({ type: 'timestamp' })
  createdAt

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt
}
