import { notFound } from 'next/navigation'
import React from 'react'
import { draftMode } from 'next/headers'
//import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { PAGE_QUERY } from '@/lib/utils/queries'
import { Page } from '@/lib/utils/pageTypes'
import { renderBlock } from '@/lib/utils/renderBlock'

interface GraphQLResponse {
	Pages: {
		docs: Page[]
	}
}

export default async function CMSPage({
	params: paramsPromise,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await paramsPromise
	const { isEnabled } = await draftMode()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let content: any[] | undefined

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: PAGE_QUERY,
					variables: { slug },
				}),
				next: { revalidate: isEnabled ? 0 : 60 }, // Disable cache for draft mode
			}
		)

		if (!response.ok) {
			throw new Error(`GraphQL request failed: ${response.statusText}`)
		}

		const result: { data?: GraphQLResponse; errors?: unknown[] } =
			await response.json()

		if (result.errors) {
			console.error('GraphQL Errors:', result.errors)
			throw new Error('GraphQL query returned errors')
		}
		console.log(result)

		content = result.data?.Pages?.docs
	} catch (error) {
		console.error('Error fetching GraphQL data:', error)
	}

	if (!content) {
		return notFound()
	}

	return (
		<div>
			{content
				.find((page) => page.slug === (slug || 'home'))
				?.layout?.map(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(block: any, index: number) => {
						console.log(block)

						return renderBlock(block, index)
					}
				)}
		</div>
	)
}
