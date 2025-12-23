/**
 * Mapping of ZIP codes to area codes used for email subject generation
 */
const ZIP_TO_AREA_MAP = {
	// AR1 mappings
	AA: "AR1",
	AB: "AR1",
	AC: "AR1",
	AE: "AR1",
	AJ: "AR1",
	AK: "AR1",
	DS: "AR1",
	NV: "AR1",

	// AR2 mappings
	BA: "AR2",
	BB: "AR2",
	BC: "AR2",
	BD: "AR2",
	BE: "AR2",
	BF: "AR2",
	BG: "AR2",
	BH: "AR2",
	RS: "AR2",
	RT: "AR2",
	DO: "AR2",

	// AR3 mappings
	CA: "AR3",
	CB: "AR3",
	CC: "AR3",
	CD: "AR3",
	CE: "AR3",
	CG: "AR3",
	AD: "AR3",
	AF: "AR3",
	AG: "AR3",
	AH: "AR3",
	DSW: "AR3",
	DZ: "AR3",

	// AR4 mappings
	DA: "AR4",
	DB: "AR4",
	DC: "AR4",
	DD: "AR4",
	DE: "AR4",
	DF: "AR4",
	DG: "AR4",
	DI: "AR4",
	CF: "AR4",
	WK: "AR4",
	DSE: "AR4",

	// NOR mappings
	AS: "NOR",
	AT: "NOR",
	AL: "NOR",
	CR: "NOR",
	ML: "NOR",
	DK: "NOR",
	TU: "NOR",
	BR: "NOR",
	TM: "NOR",
	SL: "NOR",
	GA: "NOR",
	TL: "NOR",
	BN: "NOR",
	ST: "NOR",
	DR: "NOR",
	NB: "NOR",
	AI: "NOR",

	// SOU mappings
	AR: "SOU",
	SA: "SOU",
	SB: "SOU",
	SH: "SOU",
	NS: "SOU",
	KK: "SOU",
	PL: "SOU",
	KL: "SOU",
	ES: "SOU",
	PR: "SOU",
	AY: "SOU",
	ON: "SOU",
	OS: "SOU",
	MN: "SOU",
	KY: "SOU",
	SD: "SOU",
	TH: "SOU",
	CL: "SOU",
	DV: "SOU",
	LK: "SOU",
	WA: "SOU",
	CW: "SOU",
	EY: "SOU",
	GO: "SOU",
	NR: "SOU",
	WX: "SOU",
};

/**
 * Get the area code for a given ZIP code
 * @param {string} zip - ZIP code to lookup
 * @returns {string} Area code or "Area not found" if not in mapping
 */
export function getAreaCodeFor(zip) {
	const area = ZIP_TO_AREA_MAP[zip];
	return area || "Area not found";
}
