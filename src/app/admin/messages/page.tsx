import { Suspense } from 'react'
import { Cell, IndexTable, IndexTableSkeleton } from '@/features/admin/components/index-table'
import { MessageAnswered } from '@/features/admin/components/message-answered'
import { Pagination } from '@/features/admin/components/pagination'
import { pageHref, pageNumber } from '@/features/admin/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { perPage } from '@/lib/db/queries/admin'
import { listMessages } from '@/lib/db/queries/messages'
import { z } from 'zod'

export const metadata = { title: 'Messages · Admin' }

export const instant = false

const search = z.object({ page: pageNumber })

export default async function Page({ searchParams }: PageProps<'/admin/messages'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Messages</h1>
      <p className="text-sm text-olive-600 dark:text-olive-400">
        Sent from the contact form on the help page. Unanswered ones sort to the top.
      </p>
      <Suspense key={filters.page} fallback={<IndexTableSkeleton />}>
        <Rows page={filters.page} />
      </Suspense>
    </div>
  )
}

async function Rows({ page }: { page: number }) {
  const { rows: messages, total } = await listMessages(perPage, (page - 1) * perPage)

  return (
    <>
      <IndexTable columns={['From', 'Message', 'Sent', '']} empty="Nobody has written in yet.">
        {messages.map((sent) => (
          <tr
            key={sent.id}
            className={`hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03] ${sent.answered ? 'opacity-55' : ''}`}
          >
            <Cell>
              <span className="block text-olive-950 dark:text-white">{sent.name}</span>
              <a href={`mailto:${sent.email}`} className="text-xs text-olive-600 hover:underline dark:text-olive-400">
                {sent.email}
              </a>
            </Cell>
            <Cell className="max-w-md">
              <span className="line-clamp-3 text-olive-700 dark:text-olive-300">{sent.body}</span>
            </Cell>
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">
              {sent.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Cell>
            <Cell align="right">
              <MessageAnswered id={sent.id} answered={sent.answered} from={sent.name} />
            </Cell>
          </tr>
        ))}
      </IndexTable>
      <Pagination page={page} total={total} perPage={perPage} href={(next) => pageHref('/admin/messages', {}, next)} />
    </>
  )
}
