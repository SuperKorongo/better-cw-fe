<script lang="ts">
    import { getTranslation } from '$lib/translations';
	import * as toasts from '$lib/components/toasts/toasts';
    import Button from '@smui/button';
    import Textfield from '@smui/textfield';
	import { loading } from '$lib/stores/loading/store';
    
    let email = '';
    let subject = '';
    let message = '';
    let isSubmitting = false;

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
        if (!validateForm()) return;
        if ($loading.value) return;

        loading.set(true);
        try {
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    subject,
                    message
                })
            });

            if (!response.ok) throw new Error('Failed to send message');
            
            toasts.success(getTranslation('contact.success'));
            // Clear form
            email = '';
            subject = '';
            message = '';
        } catch (error) {
            toasts.error(getTranslation('contact.errors.submitFailed'));
        } finally {
            loading.set(false);
        }
    };
</script>

<div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">{getTranslation('contact.title')}</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <Textfield
            label={getTranslation('contact.email')}
            type="email"
            bind:value={email}
            required
            class="w-full"
        />
        
        <Textfield
            label={getTranslation('contact.subject')}
            bind:value={subject}
            required
            class="w-full"
        />
        
        <Textfield
            label={getTranslation('contact.message')}
            bind:value={message}
            required
            textarea
            input$rows={4}
            class="w-full"
        />
        
        <Button
            variant="raised"
            type="submit"
            class="w-full"
        >
            {getTranslation('contact.submit')}
        </Button>
    </form>
</div>