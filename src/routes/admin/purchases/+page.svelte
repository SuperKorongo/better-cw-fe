<script lang="ts">
    import * as toasts from '$lib/components/toasts/toasts';
    import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
    import { onMount } from 'svelte';
    import { loading } from '$lib/stores/loading/store';
    import { getTranslation } from '$lib/translations';
    import { DEFAULT_PAGINATION, type PaginatedResponse, type Pagination as PaginationType } from '$lib/models/Pagination';
    import type { Payment } from '$lib/models/Payment';
    import { getMyPayments } from '$lib/services/payments';
    import HeaderCell from '$lib/components/table/HeaderCell.svelte';
    import Pagination from '$lib/components/table/Pagination.svelte';
    import { getFormattedDate, getFormattedPrice } from '$lib/utils/utils';
    import { defaultCurrency } from '$lib/stores/currency/store';

    let data: PaginatedResponse<Payment> | null = $state(null);
    let pagination: PaginationType = $state({
        ...structuredClone(DEFAULT_PAGINATION),
        limit: 10,
        orderBy: {
            column: 'created_at',
            direction: 'desc'
        }
    });

    const tableHeader = [
        { columnId: 'uuid', label: getTranslation('purchases.table.uuid') },
        { columnId: 'created_at', label: getTranslation('purchases.table.createdAt') },
        { columnId: 'price_in_cents_of_dollar', label: getTranslation('purchases.table.priceUSD') },
        { columnId: 'price_in_btc', label: getTranslation('purchases.table.priceBTC') },
        { columnId: 'status', label: getTranslation('purchases.table.status') }
    ];

    const allowedRowsPerPage: number[] = [10, 25];

    onMount(async () => {
        await loadPayments();
    });

    async function loadPayments() {
        try {
            loading.set(true);
            data = await getMyPayments(window.fetch, pagination);
        } catch {
            toasts.error(getTranslation('common.errors.generic'));
        } finally {
            loading.set(false);
        }
    }

    const ifNotLoading = (action: () => void) => {
        if ($loading.value) return;
        action();
    };

    function getTranslatedStatus(status: string): string {
        switch (status) {
            case 'AWAITING_BLOCKCHAIN_TRANSACTION':
                return getTranslation('purchases.status.awaitingBlockchain');
            case 'AWAITING_BLOCKCHAIN_CONFIRMATION':
                return getTranslation('purchases.status.awaitingConfirmation');
            case 'AWAITING_FULL_FUNDS':
                return getTranslation('purchases.status.awaitingFullFunds');
            case 'BLOCKCHAIN_CONFIRMED':
                return getTranslation('purchases.status.confirmed');
            case 'EXPIRED':
                return getTranslation('purchases.status.expired');
            case 'PAID':
                return getTranslation('purchases.status.paid');
            case 'FAILED':
                return getTranslation('purchases.status.failed');
            default:
                return status;
        }
    }
</script>

<section>
    <h1>{getTranslation('purchases.title')}</h1>
    
    {#if data !== null && data.data.length > 0}
        <div>
            <DataTable
                sortable
                style="width: 100%;"
                onSMUIDataTableSorted={({ detail }) => {
                    ifNotLoading(() => {
                        pagination = {
                            ...pagination,
                            offset: 0,
                            orderBy: {
                                column: detail.columnId,
                                direction: detail.sortValue === 'ascending' ? 'asc' : 'desc'
                            }
                        };
                        loadPayments();
                    });
                }}
            >
                <Head>
                    <Row>
                        {#each tableHeader as { columnId, label } (columnId)}
                            <HeaderCell {columnId} {label} />
                        {/each}
                    </Row>
                </Head>
                <Body>
                    {#each data.data as payment (payment.uuid)}
                        <Row>
                            <Cell>{payment.uuid}</Cell>
                            <Cell>{getFormattedDate(payment.createdAtTimestamp)}</Cell>
                            <Cell>{getFormattedPrice({ currency: defaultCurrency, value: payment.priceInCentsOfDollar / 100 })}</Cell>
                            <Cell>{payment.priceInBTC} BTC</Cell>
                            <Cell>
                                <span 
                                    class="status-cell" 
                                    class:awaiting={payment.status === 'AWAITING_BLOCKCHAIN_TRANSACTION' || 
                                                  payment.status === 'AWAITING_BLOCKCHAIN_CONFIRMATION' || 
                                                  payment.status === 'AWAITING_FULL_FUNDS'}
                                    class:confirmed={payment.status === 'BLOCKCHAIN_CONFIRMED'}
                                    class:expired={payment.status === 'EXPIRED'}
                                >
                                    {getTranslatedStatus(payment.status)}
                                </span>
                            </Cell>
                        </Row>
                    {/each}
                </Body>

                {#snippet paginate()}
                    <Pagination
                        rowsPerPageOptions={allowedRowsPerPage}
                        {pagination}
                        meta={data!.meta}
                        onFirstPage={() =>
                            ifNotLoading(() => {
                                pagination = {
                                    ...pagination,
                                    offset: 0
                                };
                                loadPayments();
                            })}
                        onPreviousPage={() =>
                            ifNotLoading(() => {
                                pagination = {
                                    ...pagination,
                                    offset: pagination.offset - pagination.limit
                                };
                                loadPayments();
                            })}
                        onNextPage={() =>
                            ifNotLoading(() => {
                                pagination = {
                                    ...pagination,
                                    offset: pagination.offset + pagination.limit
                                };
                                loadPayments();
                            })}
                        onLastPage={() =>
                            ifNotLoading(() => {
                                pagination = {
                                    ...pagination,
                                    offset: data!.meta.totalItems - pagination.limit
                                };
                                loadPayments();
                            })}
                        onChangeRowsPerPage={(value: number) =>
                            ifNotLoading(() => {
                                pagination = {
                                    ...pagination,
                                    limit: value
                                };
                                loadPayments();
                            })}
                    />
                {/snippet}
            </DataTable>
        </div>
    {:else if data !== null && data.data.length === 0}
        <p class="empty-message">{getTranslation('purchases.empty')}</p>
    {/if}
</section>

<style>
    section {
        padding: 30px 50px;
    }

    h1 {
        margin-bottom: 2rem;
        font-size: 1.5rem;
        color: #333;
    }

    .empty-message {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 1.1rem;
    }

    div :global(.mdc-data-table__row):nth-child(even) {
        background-color: #fdfdfd;
    }

    div :global(.mdc-data-table__row):hover {
        background-color: #eee;
    }

    .status-cell {
        font-weight: bold;
    }

    .awaiting {
        color: #ff9800;
    }

    .confirmed {
        color: #4caf50;
    }

    .expired {
        color: #f44336;
    }

    div :global(.status) {
        font-weight: bold;
    }

    div :global(.status.awaiting_blockchain_transaction),
    div :global(.status.awaiting_blockchain_confirmation),
    div :global(.status.awaiting_full_funds) {
        color: #ff9800;
    }

    div :global(.status.blockchain_confirmed) {
        color: #4caf50;
    }

    div :global(.status.expired) {
        color: #f44336;
    }
</style>
