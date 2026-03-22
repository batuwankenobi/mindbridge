export const colors = {
  purple50: '#EEEDFE',
  purple100: '#CECBF6',
  purple400: '#7F77DD',
  purple600: '#534AB7',
  purple800: '#3C3489',
  teal50: '#E1F5EE',
  teal400: '#1D9E75',
  teal600: '#0F6E56',
  amber50: '#FAEEDA',
  amber400: '#BA7517',
  red50: '#FCEBEB',
  red400: '#E24B4A',
  green50: '#EAF3DE',
  green400: '#639922',
  gray50: '#F8F7F4',
  gray100: '#F1EFE8',
  gray200: '#D3D1C7',
  gray400: '#888780',
  gray600: '#5F5E5A',
  gray900: '#1A1A18',
  white: '#FFFFFF'
}

export const fonts = {
  display: 'DMSerifDisplay_400Regular',
  displayItalic: 'DMSerifDisplay_400Regular_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium'
}

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
}

export const radius = {
  sm: 8, md: 12, lg: 20, xl: 28, full: 9999
}

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  }
}

export const styles = {
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.lg
  },
  title: {
    fontSize: 28,
    color: colors.gray900,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray400,
    marginBottom: 24
  },
  btnPrimary: {
    backgroundColor: colors.purple600,
    borderRadius: radius.sm,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '500'
  },
  btnSecondary: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray200
  },
  btnSecondaryText: {
    color: colors.gray900,
    fontSize: 15,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: radius.sm,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.gray900,
    backgroundColor: colors.white,
    marginBottom: spacing.md
  }
}
