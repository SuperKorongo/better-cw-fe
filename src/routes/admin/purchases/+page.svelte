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
    import Button from '@smui/button';
    import { goto } from '$app/navigation';

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
        { columnId: 'created_at', label: getTranslation('purchases.table.createdAt')},
        { columnId: 'price_in_cents_of_dollar', label: getTranslation('purchases.table.priceUSD') },
        { columnId: 'price_in_btc', label: getTranslation('purchases.table.priceBTC') },
        { columnId: 'status', label: getTranslation('purchases.table.status') },
        { columnId: 'videos', label: getTranslation('purchases.table.videos') }
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
            default:
                return status;
        }
    }
</script>

<section>
    {#if data !== null && data.data.length > 0}
        <h1>{getTranslation('purchases.title')}</h1>
        <div>
            <DataTable style="width: 100%;">
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
                            <Cell>
                                <span class="videos-cell">
                                    {payment.videos.map(v => v.title).join(', ')}
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
        <div class="empty-state">
            <div class="empty-message-container">
                <h2>{getTranslation('purchases.empty')}</h2>
                <p class="subtitle">{getTranslation('purchases.emptyDescription')}</p>
                
                <div class="features">
                    <div class="feature">
                        <span class="feature-icon">🔒</span>
                        <span class="feature-text">{getTranslation('purchases.securePayment')}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⚡️</span>
                        <span class="feature-text">{getTranslation('purchases.instantAccess')}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🎥</span>
                        <span class="feature-text">{getTranslation('purchases.hdQuality')}</span>
                    </div>
                </div>

                <Button 
                    variant="raised"
                    class="browse-button"
                    onclick={() => goto('/')}
                >
                    {getTranslation('purchases.browseCTA')}
                </Button>
            </div>
        </div>
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

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        margin: 0 auto;
    }

    @media (min-width: 600px) {
        .empty-state {
            max-width: 600px;
        }
    }

    @media (max-width: 599px) {
        .empty-state {
            width: 100%;
            padding: 20px 10px;
        }

        section {
            padding: 0;
        }

        .empty-message-container {
            border-radius: 0;
        }
    }

    .empty-message-container {
        background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .subtitle {
        color: #666;
        font-size: 1.1rem;
        line-height: 1.5;
        margin-bottom: 2rem;
    }

    .features {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
        flex-wrap: wrap;
    }

    .feature {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .feature-icon {
        font-size: 2rem;
    }

    .feature-text {
        color: #444;
        font-size: 1rem;
    }

    .videos-cell {
        display: block;
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.browse-button) {
        background: linear-gradient(45deg, #40c4ff, #a23cff);
        color: white;
        padding: 12px 32px;
        font-size: 1.1rem;
        border-radius: 25px;
        transition: transform 0.2s ease;
    }

    :global(.browse-button:hover) {
        transform: translateY(-2px);
    }
</style>
