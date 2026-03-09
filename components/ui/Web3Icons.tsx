import type { IconBaseProps } from 'react-icons';

export const SolidityIcon = (props: IconBaseProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 32 32"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M19.3 2L24.5 11.5H14.1L19.3 2Z" opacity="0.9" />
    <path d="M8.7 11.5L13.9 2H24.1L18.9 11.5H8.7Z" opacity="0.5" />
    <path d="M12.7 30L7.5 20.5H17.9L12.7 30Z" opacity="0.9" />
    <path d="M23.3 20.5L18.1 30H7.9L13.1 20.5H23.3Z" opacity="0.5" />
  </svg>
);

export const SolanaIcon = (props: IconBaseProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 32 32"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M5 22.5H25.5L22.5 25.5H5L7.5 22.5Z" />
    <path d="M5 14.5H27.5L24.5 17.5H5L7.5 14.5Z" />
    <path d="M7.5 6.5H27.5L24.5 9.5H5L7.5 6.5Z" />
  </svg>
);

export const ArbitrumIcon = (props: IconBaseProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 32 32"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" opacity="0.2" stroke="none" />
    <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 22L16 9L21 22H18.5L16 15.5L13.5 22H11Z" stroke="none" />
  </svg>
);

export const BaseIcon = (props: IconBaseProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 32 32"
    height="1em"
    width="1em"
    {...props}
  >
    <circle cx="16" cy="16" r="13" />
    <circle cx="16" cy="16" r="8" fill="white" opacity="0.2" />
  </svg>
);
