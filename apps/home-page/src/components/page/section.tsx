import { cn } from '@repo/utils';
import { useEffect, useRef } from 'react';
import { useHomepage } from '../../providers/homepage-provider';

type SectionProps = {
  children: React.ReactNode;
  name: string;
  className?: string;
};
const Section = ({ children, name, className }: SectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setActiveSection, offset } = useHomepage();

  useEffect(() => {
    const top = ref.current?.getBoundingClientRect().top ?? -1;
    const bottom = ref.current?.getBoundingClientRect().bottom;
    // if the top is within 100px of the top of the screen, it's the active section
    if (top < 0) return;
    if (top < 100) {
      setActiveSection(name);
    }
    if (!bottom) return;
    if (bottom <= window.innerHeight && name === 'projects') {
      setActiveSection(name);
    }
  }, [offset, setActiveSection, name]);

  return (
    <section
      id={name}
      className={cn(
        'relative w-full shrink-0 border-0 pt-24 text-slate-300',
        className,
      )}
      ref={ref}
    >
      {children}
    </section>
  );
};

export { Section };
