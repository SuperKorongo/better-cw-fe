<script lang="ts">
    import * as toasts from '$lib/components/toasts/toasts';
    import { getTranslation } from '$lib/translations';
    import Button from '@smui/button';
    import Textfield from '@smui/textfield';
    import { loading } from '$lib/stores/loading/store';
    import { sendContactMessage } from '$lib/services/contact';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    onMount(() => loading.set(false));
    
    let email = '';
    let subject = '';
    let message = '';

    const validateForm = () => {
        // Email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
            toasts.error(getTranslation('contact.errors.invalidEmail'));
            return false;
        }

        // Subject validation
        if (!subject || subject.length < 2 || subject.length > 100) {
            toasts.error(getTranslation('contact.errors.invalidSubject'));
            return false;
        }

        // Message validation
        if (!message || message.length < 10 || message.length > 500) {
            toasts.error(getTranslation('contact.errors.invalidMessage'));
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if ($loading.value) return;
        if (!validateForm()) return;
        
        loading.set(true);
        try {
            await sendContactMessage(email, subject, message);
            toasts.success(getTranslation('contact.success'));
            goto('/');
        } catch (error) {
            toasts.error(getTranslation('contact.errors.submitFailed'));
        } finally {
            loading.set(false);
        }
    };
</script>

<main>
    <div class="container">
        <h1>{getTranslation('contact.title')}</h1>
        
        <form on:submit|preventDefault={handleSubmit}>
            <Textfield
                label={getTranslation('contact.email')}
                type="email"
                bind:value={email}
                required
            />
            
            <Textfield
                label={getTranslation('contact.subject')}
                bind:value={subject}
                required
            />
            
            <Textfield
                label={getTranslation('contact.message')}
                bind:value={message}
                required
                textarea
                input$rows={4}
            />
            
            <Button variant="raised" type="submit">
                {getTranslation('contact.submit')}
            </Button>
        </form>
    </div>
</main>

<style>
    main {
        top: var(--navbar-height);
        position: absolute;
        background-color: white;
        z-index: -1;
        box-shadow: 0px 0px 10px 5px #686800;
    }

    @media (max-width: 600px) {
        main {
            left: 2.5%;
            width: 95%;
        }
    }
    @media (min-width: 600px) {
        main {
            left: 10%;
            width: 80%;
        }
    }
    @media (min-width: 1200px) {
        main {
            left: 20%;
            width: 60%;
        }
    }
    @media (min-width: 1600px) {
        main {
            left: 25%;
            width: 50%;
        }
    }

    .container {
        padding: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
    }
</style>