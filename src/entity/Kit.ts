import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
	OneToMany,
	ManyToMany,
	ManyToOne
} from 'typeorm'
import User from './User'
import Item from './Item'

@Entity()
export default class Kit extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date
	
	@Column("uuid")
	creator_id!: string
	
	@ManyToOne(type => User, user => user.Kits, { onDelete: 'CASCADE' })
    member: User

	@OneToMany(type => Item, item => item.kit)
	items: Item[]
}