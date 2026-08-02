'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Transition,
  type Variant,
} from 'motion/react';
import { cn } from '@/lib/utils';
import { Plus, XIcon } from 'lucide-react';

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

type DialogProviderProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function DialogProvider({ children, transition }: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </DialogContext.Provider>
  );
}

type DialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function Dialog({ children, transition }: DialogProps) {
  return (
    <DialogProvider transition={transition}>
      {children}
    </DialogProvider>
  );
}

type DialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function DialogTrigger({ children, className, style }: DialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useDialog();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen]
  );

  return (
    <motion.div
      ref={triggerRef as React.Ref<HTMLDivElement>}
      layoutId={`dialog-${uniqueId}`}
      className={cn('relative cursor-pointer', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`dialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function DialogContent({ children, className, style }: DialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useDialog();
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstFocusableElement, setFirstFocusableElement] =
    useState<HTMLElement | null>(null);
  const [lastFocusableElement, setLastFocusableElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
      if (event.key === 'Tab') {
        if (!firstFocusableElement || !lastFocusableElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else if (document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen, firstFocusableElement, lastFocusableElement]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement);
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement
        );
        (focusableElements[0] as HTMLElement).focus();
      }
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    } else {
      document.body.classList.remove('overflow-hidden');
      triggerRef.current?.focus();
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('overflow-hidden', className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${uniqueId}`}
      aria-describedby={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type DialogContainerProps = {
  children: React.ReactNode;
  className?: string;
};

function DialogContainer({ children, className }: DialogContainerProps) {
  const { isOpen, setIsOpen, uniqueId } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-50 h-full w-full bg-royal-deep/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'fixed inset-0 z-50 mx-auto flex w-fit items-start justify-center overflow-y-auto',
              className
            )}
          >
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

type DialogTitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function DialogTitle({ children, className, style }: DialogTitleProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
      id={`dialog-title-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type DialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function DialogSubtitle({ children, className, style }: DialogSubtitleProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

type DialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function DialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: DialogDescriptionProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type DialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

function DialogImage({ src, alt, className, style }: DialogImageProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  );
}

type DialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function DialogClose({ children, className, variants }: DialogCloseProps) {
  const { setIsOpen, uniqueId } = useDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn('absolute right-5 top-5', className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <XIcon size={24} />}
    </motion.button>
  );
}

export interface LinearCardItem {
  id: number;
  url: { src: string };
  title: string;
  description: string;
  tags: string[];
}

interface LinearCardProps {
  items: LinearCardItem[];
  className?: string;
}

/**
 * Linear Card grid — image cards that expand into a shared-layout dialog.
 * Adapted from 21st.dev / UI Layouts Linear Card for Who we supply.
 */
const LinearCard = forwardRef<HTMLDivElement, LinearCardProps>(
  ({ items, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
      >
        {items.map((item) => (
          <Dialog
            key={item.id}
            transition={{
              type: 'spring',
              bounce: 0.05,
              duration: 0.5,
            }}
          >
            <DialogTrigger
              style={{ borderRadius: '24px' }}
              className="group flex w-full flex-col overflow-hidden border border-line bg-surface shadow-card transition-colors hover:border-royal-wash hover:bg-royal-tint"
            >
              <DialogImage
                src={item.url.src}
                alt={item.title}
                className="h-56 w-full object-cover sm:h-64"
              />
              <div className="relative flex flex-grow flex-row items-end justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0 pr-12">
                  {item.tags[0] ? (
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-royal">
                      {item.tags[0]}
                    </p>
                  ) : null}
                  <DialogTitle className="mt-1 text-balance text-xl font-semibold tracking-[-0.03em] text-ink">
                    {item.title}
                  </DialogTitle>
                </div>
                <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-royal text-white shadow-cta transition-colors group-hover:bg-royal-bright sm:bottom-5 sm:right-5">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </DialogTrigger>

            <DialogContainer className="px-4 pb-10 pt-16 sm:pt-20">
              <DialogContent
                style={{ borderRadius: '32px' }}
                className="relative mx-auto flex h-auto max-h-[90svh] w-[92%] max-w-[900px] flex-col overflow-y-auto border border-line bg-surface shadow-card-hover"
              >
                <DialogImage
                  src={item.url.src}
                  alt={item.title}
                  className="mx-auto h-auto max-h-[42vh] w-full object-cover sm:max-h-[50vh] sm:w-[70%] sm:object-contain sm:pt-6"
                />
                <div className="p-6 sm:p-8">
                  {item.tags[0] ? (
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-royal">
                      {item.tags[0]}
                    </p>
                  ) : null}
                  <DialogTitle className="mt-2 text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
                    {item.title}
                  </DialogTitle>

                  <DialogDescription
                    disableLayoutAnimation
                    variants={{
                      initial: { opacity: 0, scale: 0.95, y: -24 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      exit: { opacity: 0, scale: 0.95, y: -28 },
                    }}
                  >
                    <p className="mt-4 max-w-2xl text-pretty text-body text-ink-muted">
                      {item.description}
                    </p>
                    {item.tags.length > 1 ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {item.tags.slice(1).map((tag) => (
                          <li
                            key={tag}
                            className="rounded-pill border border-royal-wash bg-royal-tint px-3 py-1.5 text-caption font-medium text-royal"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </DialogDescription>
                </div>
                <DialogClose className="grid h-11 w-11 place-items-center rounded-full bg-royal-tint text-royal transition-colors hover:bg-royal hover:text-white" />
              </DialogContent>
            </DialogContainer>
          </Dialog>
        ))}
      </div>
    );
  }
);

LinearCard.displayName = 'LinearCard';

export default LinearCard;

export {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogSubtitle,
  DialogDescription,
  DialogImage,
};
