'use server';

import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { toLoanData, toLoanInput, validateLoan } from '@/lib/loan-validate';
import type { LoanFormState } from '@/lib/loan-validate';
import { cancelLoan, submitLoan } from '@/lib/loans';
import { revalidatePath } from 'next/cache';

export async function createLoanAction(
  prevState: LoanFormState,
  formData: FormData
): Promise<LoanFormState> {
  const session = await auth();
  const role = session?.user?.role;
  const userEmail = session?.user?.email;

  if (!userEmail || !can(role, 'loan:create')) {
    throw new Error('Không có quyền');
  }

  const input = toLoanInput(formData);
  const errors = validateLoan(input, db.books);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: input,
      ok: false,
    };
  }

  const loanData = toLoanData(input);
  const result = submitLoan(userEmail, loanData);

  if (!result.ok) {
    return {
      errors: {},
      values: input,
      message: result.message,
      ok: false,
    };
  }

  revalidatePath('/loans');
  return {
    errors: {},
    values: {},
    message: 'Đã gửi yêu cầu, chờ duyệt',
    ok: true,
  };
}

export async function cancelLoanAction(id: number) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return;
  }

  cancelLoan(userEmail, id);
  revalidatePath('/loans');
}
