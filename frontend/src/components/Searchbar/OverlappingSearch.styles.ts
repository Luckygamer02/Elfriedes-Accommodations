import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
    heroSection: {
        backgroundColor: theme.colors.blue[6],
        padding: `${theme.spacing.xl} 0`,
        position: 'relative',
    },
    searchContainer: {
        position: 'relative',
        maxWidth: 1200,
        margin: '0 auto',
        marginTop: -50,
        zIndex: 1,
    },
    searchBar: {
        padding: theme.spacing.lg,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.md,
        backgroundColor: theme.white,
        border: `1px solid ${theme.colors.gray[2]}`,
    },
}));