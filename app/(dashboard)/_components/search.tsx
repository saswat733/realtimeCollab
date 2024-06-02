import qs from 'query-string';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from './sidebar/useDebounce'; // Assuming useDebounce is in the same directory

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: '/',
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative flex items-center">
      <Input
        onChange={handleChange}
        value={value}
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
      />
    </div>
  );
};
