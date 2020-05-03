import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
	OneToMany,
	UpdateDateColumn
} from 'typeorm'
import Collection from './Collection'
import jwt from 'jsonwebtoken'

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string
	
	@Column({ nullable: true })
    email: string
	
	@Column({ nullable: true })
    isAdmin: boolean
	
	@Column({ nullable: true })
    profilePhoto: string
	
	@Column({ nullable: true })
    strategy: string
	
	@Column({ nullable: true })
    googleId: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date
	
	@UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date
	
	@OneToMany(type => Collection, collection => collection.member, { cascade: true, onDelete: 'CASCADE' })
    collections: Collection[];

}