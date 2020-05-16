import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    OneToMany,
    ManyToOne
} from 'typeorm'
import User from './User'
import Kit from './Kit'

@Entity()
export default class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column()
    price: number

    @Column()
    brand: string

    @Column("simple-array", { nullable: true })
    imageUrls: string[]

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date
	
	@Column("uuid")
	creator_id!: string
	
	@ManyToOne(type => Kit, kit => kit.items, { cascade: true, onDelete: "CASCADE" })
	kit: Kit
}