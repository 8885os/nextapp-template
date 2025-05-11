import Hero from '@/components/Hero'
import ImageGrid from '@/components/ImageGrid'
import ImageHero from '@/components/ImageHero'
import { Richtext } from '@/components/Richtext'
import SecondaryHero from '@/components/SecondaryHero'
import WorkTabs from '@/components/WorkTabs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderBlock(block: any, index: number, collection?: any[]) {
	switch (block.__typename) {
		case 'Hero':
			return (
				<section key={`${block.__typename}-${index}`}>
					<ImageHero
						slug={block.slug}
						heading={block.heading}
						image={block.image}
						alt={block.alt}
					/>
				</section>
			)

		case 'RichText':
			return (
				<section key={`${block.__typename}-${index}`} className='w-full'>
					<div className='ml-auto w-[60%] mt-10 mb-10'>
						<Richtext data={block.content} />
					</div>
				</section>
			)

		case 'ImageGrid':
			return (
				<section key={`${block.__typename}-${index}`}>
					<ImageGrid images={block.images} />
				</section>
			)
		case 'PageHero':
			return (
				<section key={`${block.__typename}-${index}`}>
					<Hero key={index} layout={block} />
				</section>
			)
		case 'SecondaryHero':
			return (
				<section key={`${block.__typename}-${index}`}>
					<SecondaryHero block={block} />
				</section>
			)
		case 'Accordion':
			return (
				<section key={`${block.__typename}-${index}`} className='w-full'>
					<div className='ml-auto w-[60%] mt-10 mb-10'>
						<Richtext data={block.content} />
					</div>
				</section>
			)
		case 'WorkTabs':
			if (!collection) return null
			return (
				<section key={`${block.__typename}-${index}`} className='w-full'>
					<WorkTabs works={collection} />
				</section>
			)

		default:
			return null
	}
}
