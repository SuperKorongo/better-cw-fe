<script lang="ts">
    import * as toasts from '$lib/components/toasts/toasts';
    import { onMount } from 'svelte';
    import { loading } from '$lib/stores/loading/store';
    import { DEFAULT_PAGINATION, type PaginatedResponse, type Pagination as PaginationType } from '$lib/models/Pagination';
    import type { Payment } from '$lib/models/Payment';
    import { getMyPayments } from '$lib/services/payments';
    import PurchasesTable from '$lib/components/admin/purchases/PurchasesTable.svelte';
    import NoPurchases from '$lib/components/admin/purchases/NoPurchases.svelte';
	import { getTranslation } from '$lib/translations';

    let data: PaginatedResponse<Payment> | null = $state(null);
    let pagination: PaginationType = $state({
        ...structuredClone(DEFAULT_PAGINATION),
        limit: 10,
        orderBy: {
            column: 'created_at',
            direction: 'desc'
        }
    });

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
</script>

<section>
    {#if data !== null && data.data.length > 0}
        <h1>{getTranslation('purchases.title')}</h1>
        <div>
            <PurchasesTable 
                {data} 
                {pagination} 
                onChangePagination={(newPagination) => {
                    pagination = newPagination;
                    loadPayments();
                }}
            />
        </div>
    {:else if data !== null && data.data.length === 0}
        <NoPurchases />
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

    @media (max-width: 599px) {
        section {
            padding: 0;
        }
    }
</style>
