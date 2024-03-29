import { PaymentStatus } from '@digitalhippo/components/payment-status';
import { PRODUCT_CATEGORIES } from '@digitalhippo/config';
import { getPayloadClient } from '@digitalhippo/get-payload';
import { getServerSideUser } from '@digitalhippo/lib/payload-utils';
import { cn, formatPrice } from '@digitalhippo/lib/utils';
import { Media, Product, ProductFile } from '@digitalhippo/payload-types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const ThankYouPage = async ({ searchParams: { orderId } }: Props) => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  const TRANSACTION_FEE = 1;

  const payload = await getPayloadClient();
  if (!payload) return null;

  const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) return notFound();

  const orderUserId =
    typeof order.user === 'string' ? order.user : order.user.id;
  if (orderUserId !== user?.id)
    return redirect(`/login?origin=thank-you?orderId=${orderId}`);

  const orderSubTotal = (order.products as Product[]).reduce(
    (acc, product) => acc + product.price,
    0,
  );

  const orderEmail =
    typeof order.user === 'string' ? order.user : order.user.email;

  return (
    <main className='relative lg:min-h-full'>
      <div className='hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
        <Image
          fill
          src='/checkout-thank-you.jpg'
          className='h-full w-full object-cover object-center'
          alt='Thank you for your purchase!'
        />
      </div>

      <div>
        <div
          className={cn(
            'mx-auto max-w-2xl px-4 py-16',
            'sm:px-6 sm:py-24',
            'lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32',
            'xl:gap-x-24',
          )}
        >
          <div className='lg:col-start-2'>
            <p className='text-sm font-medium text-blue-600'>
              Order successful
            </p>
            <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              Thanks for ordering!
            </h1>
            {order._isPaid ? (
              <p className='text-muted-foreground mt-2 text-base'>
                Your order was processed & your assets are available to download
                below. We&apos;ve sent your receipt & order details to{' '}
                <span className='font-medium text-gray-900'>{orderEmail}</span>.
              </p>
            ) : (
              <p className='text-muted-foreground mt-2 text-base'>
                We appreciate your order, & we&apos;re currently processing it.
                Hang tight & we&apos;ll send you confirmation very soon!
              </p>
            )}

            <div className='mt-16 text-sm font-medium'>
              <div className='text-muted-foreground'>Order number:</div>
              <div className='mt-2 text-gray-900'>{order.id}</div>

              <ul className='text-muted-foreground mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium'>
                {(order.products as Product[]).map((product) => {
                  const label =
                    PRODUCT_CATEGORIES.find(
                      (category) => category.id === product.category,
                    )?.label || '';

                  const downloadUrl = (product.productFiles as ProductFile)
                    .url as string;

                  const image = product.images[0].image as Media;

                  return (
                    <li key={product.id} className='flex space-x-6 py-6'>
                      <div className='relative h-24 w-24'>
                        <Image
                          src={image.url || ''}
                          fill
                          alt={`${product.name} image`}
                          className='flex-none rounded-md bg-gray-100 object-cover object-center'
                        />
                      </div>

                      <div className='flex flex-auto flex-col justify-between'>
                        <div className='space-y-1'>
                          <h3 className='text-gray-900'>{product.name}</h3>
                          <p className='my-1'>Category: {label}</p>
                        </div>

                        {order._isPaid && (
                          <a
                            href={downloadUrl}
                            download={product.name}
                            className='w-fit text-blue-600 underline-offset-2 hover:underline'
                          >
                            Download Assets
                          </a>
                        )}
                      </div>

                      <p className='flex-none font-medium text-gray-900'>
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className='text-muted-foreground space-y-6 border-t border-gray-200 pt-6 text-sm font-medium'>
                <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p>{formatPrice(orderSubTotal)}</p>
                </div>
                <div className='flex justify-between'>
                  <p>Transaction Fee</p>
                  <p>{formatPrice(TRANSACTION_FEE)}</p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                  <p className='text-base'>Total</p>
                  <p className='text-base'>
                    {formatPrice(orderSubTotal + TRANSACTION_FEE)}
                  </p>
                </div>
              </div>

              <PaymentStatus
                orderEmail={orderEmail}
                orderId={order.id}
                isPaid={order._isPaid}
              />

              <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                <Link
                  href='/products'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
