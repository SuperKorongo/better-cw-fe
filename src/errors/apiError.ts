type ErrorDTO = {
	readonly error: string;
};

export type ApiError = ReturnType<typeof apiError>;
export const apiError = (httpResponse: Response) => {
	const getCode = (): number => {
		return httpResponse.status;
	};

	const getErrorDTO = async (): Promise<ErrorDTO> => {
		try {
			return await httpResponse.json();
		} catch {
			return { error: 'internal server error' };
		}
	};

	return {
		getCode,
		getErrorDTO
	};
};
