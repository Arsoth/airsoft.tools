export const springList = [
	85, 90, 95, 100, 105, 110, 113, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220,
	230, 240, 250, 260, 270, 280, 290, 300
];

export const barrelDiameters = [5.98, 6, 6.01, 6.02, 6.03, 6.05, 6.08, 6.23];

export const boltCyls = {
	'Select...': { diameter: '', length: '', cylHead: '' },
	VSR: { diameter: 0, length: 0, cylHead: 0 },
	'VSR (PDI)': { diameter: 0, length: 0, cylHead: 0 },
	'VSR Bore Up (PDI)': { diameter: 0, length: 0, cylHead: 0 },
	'SRS (Pull)': { diameter: 0, length: 0, cylHead: 0 },
	'SRS (Push)': { diameter: 0, length: 0, cylHead: 0 },
	'Ares Striker': { diameter: 23.75, length: 65.4, cylHead: 8.75 },
	'APS2/L96': { diameter: 0, length: 0, cylHead: 0 }
};
export const aegCyls = {
	'Select...': { diameter: '', length: '' },
	'Type A, Full, 0': { diameter: 23.8, length: 72.25 },
	'Type B': { diameter: 23.8, length: 64.75 },
	'Type C, 4/5, I': { diameter: 23.8, length: 53.5 },
	'Type D, 3/4, II': { diameter: 23.8, length: 48.9 },
	'Type E, 2/3': { diameter: 23.8, length: 46.5 },
	'Type F, 1/2, III': { diameter: 23.8, length: 35.25 },
	'V2.5': { diameter: 23.8, length: 82 },
	'Bore Up': { diameter: 24.7, length: 72.25 }
	// 'RA D': {'diameter': 23.75, 'length': 0},
	// 'RA C': {'diameter': 23.75, 'length': 0},
	// 'RA B': {'diameter': 23.75, 'length': 0},
	// 'RA A': {'diameter': 23.75, 'length': 0},
};
export const cylTypes = { AEG: aegCyls, Bolt: boltCyls };

export const gearTeeth = {
	'SSG (16T)': 16,
	'V2.5 (19T)': 19,
	'DSG (8T)': 8,
	'DSG (9T)': 9,
	'DSG (10T)': 10,
	'TSG (5T)': 5
};

export const gearShotsPerCycle = {
	SSG: 1,
	DSG: 2,
	TSG: 3
};

export const aegBarrelList = [
	{ barrelLength: 110, usedBy: `TM MP5K` },
	{ barrelLength: 127.5, usedBy: `TM Vz61` },
	{ barrelLength: 141, usedBy: `TM MP5K PDW` },
	{ barrelLength: 155, usedBy: `` },
	{ barrelLength: 182, usedBy: `TM/Wellfire MP7A1` },
	{ barrelLength: 195, usedBy: `STAR UMP` },
	{ barrelLength: 205, usedBy: `G&G UMG` },
	{ barrelLength: 208, usedBy: `TM/China Clone/Hap-Dong G3 SAS` },
	{ barrelLength: 220, usedBy: `STAR L85A2 Carbine` },
	{
		barrelLength: 229,
		usedBy: `TM/ICS/CA/Academy/China Clone MP5A4/A5/RAS/SD5/SD6, AK-47 Beta Spetsnaz, VFC AKS74UN, Academy AK74SU, CA HK53`
	},
	{ barrelLength: 245, usedBy: `TM UZI` },
	{
		barrelLength: 247,
		usedBy: `M CAR15, TM SG552, TM/Academy SG552, TM/CA/China Clone G36C, TM/China Clone P90`
	},
	{ barrelLength: 260, usedBy: `` },
	{ barrelLength: 263, usedBy: `ICS Sig552` },
	{ barrelLength: 267, usedBy: `VFC SCAR H CQC` },
	{ barrelLength: 275, usedBy: `VFC SCAR L CQC` },
	{ barrelLength: 280, usedBy: `CA SAR M41 FS Offizier, CA M15A4 CQB` },
	{ barrelLength: 285, usedBy: `TM MC51` },
	{ barrelLength: 300, usedBy: `M1A1 Thompson, TM M733, G&P M4A1 Commando` },
	{ barrelLength: 304, usedBy: `G&G FS51 Fixed Stock` },
	{ barrelLength: 330, usedBy: `` },
	{ barrelLength: 335, usedBy: `CA SA58` },
	{ barrelLength: 355, usedBy: `G36C` },
	{ barrelLength: 357, usedBy: `CA36K/STAR G36K` },
	{ barrelLength: 360, usedBy: `Academy M4A1, King Arms Galil SAR` },
	{
		barrelLength: 363,
		usedBy: `CA M15 Carbine Series, SR-16, S-System, TM XM177-E2, SCAR, G36K, M249 Para, JLS FN2000, King Arms Sig 556, STAR FNC, TM M4A1/M4RIS/SR16, TM SG551, Toystar K1A`
	},
	{ barrelLength: 364, usedBy: `CA SLR105A1 COMPACT` },
	{ barrelLength: 368, usedBy: `SRC XM8` },
	{ barrelLength: 370, usedBy: `ICS Sig551` },
	{ barrelLength: 380, usedBy: `VFC SCAR L Standard` },
	{ barrelLength: 384, usedBy: `CA SCAR L` },
	{ barrelLength: 407, usedBy: `` },
	{ barrelLength: 415, usedBy: `CA SLR105A1, ICS AK74M, VFC AK74 Series` },
	{ barrelLength: 420, usedBy: `SOC-16, CA M14 Scout` },
	{ barrelLength: 422, usedBy: `M249 (non-para)` },
	{ barrelLength: 430, usedBy: `CA HK33E` },
	{ barrelLength: 437, usedBy: `TM Type 89/89S` },
	{ barrelLength: 440, usedBy: `TM SOCOM16` },
	{ barrelLength: 445, usedBy: `G&G FNC Long` },
	{ barrelLength: 455, usedBy: `STAR/G&P/TOP/CA M249 Para, TM AK47/AK47S/AK47M` },
	{ barrelLength: 463, usedBy: `SLR-105, RK-103, CA M14 SCOUT, G&G M14 SOC16` },
	{ barrelLength: 469, usedBy: `G3 SG1, CA SAR Taktik, CA SARM41, TM G3A3/G3A4/G3SG1` },
	{ barrelLength: 470, usedBy: `Academy L85A1` },
	{ barrelLength: 472, usedBy: `FAMAS F1, FAMAS SV` },
	{ barrelLength: 475, usedBy: `VFC MK43 Mod 0` },
	{ barrelLength: 485, usedBy: `real sword type 97b` },
	{ barrelLength: 495, usedBy: `G36E` },
	{ barrelLength: 500, usedBy: `TM M14/China Clone` },
	{ barrelLength: 504, usedBy: `Academy M16A1` },
	{
		barrelLength: 509,
		usedBy: `CA AUG A1/A2, CA G36E, ICS/G&G/STAR L85A1/A2, STAR G36, TM/CA AUG, TM/CA M16A1/A2/VN, TOP/STAR/CA/G&P M249 Mk1/MK2`
	},
	{ barrelLength: 510, usedBy: `L85, CA SR25 Match/AR10` },
	{ barrelLength: 520, usedBy: `G&G M14/CA M14` },
	{ barrelLength: 534, usedBy: `TM SIG 550` },
	{
		barrelLength: 550,
		usedBy: `M16A2 (Long), M16VN (Long), AUG (Long), King Arms FN FAL, STAR L86A2`
	},
	{ barrelLength: 590, usedBy: `TM PSG-1` },
	{ barrelLength: 631, usedBy: `CA SVD Dragunov` },
	{ barrelLength: 650, usedBy: `TM PSG-1 (Long)` }
];

export const gbbBarrelList = [
	{ barrelLength: 304, usedBy: `Ares Striker` },
	{ barrelLength: 430, usedBy: `VSR10` }
];
