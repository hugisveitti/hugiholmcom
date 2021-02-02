// create rectangles
// split world into latitude of 10 degrees size each
// for each split define longetude that are valid, i.e. not sea and with possible images

const worldMapSplits = [
  {
    max: 67,
    min: 60,
    latInterVal: [
      {
        max: 61.5,
        min: 59,
        lngIntervals: [
          {
            min: -151,
            max: -148, // alaska
          },
          { min: -116, max: -113 }, // canada
          { min: 5, max: 10 }, // norway
        ],
      },
      {
        max: 61,
        min: 60.6,
        lngIntervals: [
          { min: -46, max: -45.3 }, // greenland
        ],
      },
      {
        max: 66.1,
        min: 63.1,
        lngIntervals: [
          {
            min: -23.7,
            max: -13.4, // iceland
          },
        ],
      },
      {
        max: 67,
        min: 58,
        lngIntervals: [
          {
            min: 10,
            max: 18.4,
          }, // sweden

          { min: 21.2, max: 30.9 }, // finland
        ],
      },
      {
        max: 62.5,
        min: 61.5,
        lngIntervals: [
          {
            min: 132,
            max: 135,
          }, // east siberia
        ],
      },
    ],
  },
  {
    max: 60,
    min: 50,
    latInterVal: [
      {
        max: 52.3,
        min: 46.9,
        lngIntervals: [
          { min: -126.8, max: -117.7 }, // west canada
          { min: -107.5, max: -102.7 }, // middle canada
          { min: -119.3, max: -111.3 }, // edmonton
        ],
      },
      {
        max: 50,
        min: 48.9,
        lngIntervals: [
          { min: -100, max: -97.1 }, //winnipeg
          { min: -77.6, max: -76.8 }, // east canada
        ],
      },
      {
        min: 51.5,
        max: 55,
        lngIntervals: [
          { min: -10.4, max: -5.7 }, // Ireland
          { min: -5.1, max: 0.2 }, // middle england
        ],
      },
      {
        min: 55.2,
        max: 58.6,
        lngIntervals: [
          { min: -5.9, max: -2.8 }, // scotland
        ],
      },
      {
        min: 54.8,
        max: 57.5,
        lngIntervals: [
          { min: 8, max: 16.7 }, // DK, sweden
        ],
      },
      {
        min: 55.15,
        max: 59.3,
        lngIntervals: [
          { min: 21.3, max: 28.5 }, // baltics
          { min: 34.1, max: 41.7 }, // moskva
        ],
      },
      {
        max: 55.3,
        min: 52.5,
        lngIntervals: [
          { max: 56.6, min: 48 }, // ufa, samara in russia
        ],
      },
      {
        min: 51.6,
        max: 53.3,
        lngIntervals: [{ min: 103.7, max: 107.4 }], // Lake Baikal
      },
      {
        min: 53.1,
        max: 53.9,
        lngIntervals: [
          { min: 157.9, max: 159 }, // Kamchatskiy
        ],
      },
    ],
  },
  {
    max: 50,
    min: 40,
    lngIntervals: [
      { min: -124, max: -100 }, // USA West
      { min: -100, max: -70 }, // USA east
      { min: -9, max: 7 }, // spain and portugal, france
      { min: 6, max: 16 }, // italy, croatia, ger, swiss, austria, more
      { min: 15, max: 29 }, // east europe
      { min: 30, max: 40 }, // ukrain
      { min: 52, max: 129 }, // kazak, china, mongolia
      { min: 140, max: 146 }, // north japan
    ],
  },
  {
    max: 40,
    min: 30,
    lngIntervals: [
      { min: -124, max: -109 }, // west usa, mexico
      { min: -109, max: -90 }, // middle usa, upto mississippi
      { min: -90, max: -73 }, // east usa
      { min: -10, max: 0.5 }, // spain, portugal, marocco
      { min: -1, max: 20 }, // north africa, south italy
      { min: 20, max: 35 }, // greece, turkey, egypt
      { min: 35, max: 48 }, // middle east
      { min: 48, max: 60 }, // iran, turkmenistan
      { min: 60, max: 80 }, // stans
      { min: 80, max: 120 }, // CHINA
      { min: 124, max: 130 }, // Koreas
      { min: 130, max: 140 }, // Japan
    ],
  },
  {
    max: 30,
    min: 20,
    lngIntervals: [
      { min: -116, max: -97 }, // mexico, texas
      { min: -85, max: -72 }, // carabean islands, florida
      // { min: -17, max: -15 }, // sahara
      { min: 29, max: 35 }, // egypt
      { min: 34, max: 49 }, // saudi arabi, israel
      { min: 50, max: 60 }, // arab countries, Oman, Iran
      { min: 60, max: 70 }, // Pakistan
      { min: 70, max: 89 }, // India, Nepal
      { min: 89, max: 101 }, // Bangladesh, Myanmar, China, Lao
      { min: 100, max: 107 }, // North Vietname, Lao
      { min: 120, max: 122 }, // Taiwan, china
      { min: 200, max: 205 }, // Hawaii
    ],
  },
  {
    max: 20,
    min: 10,
    lngIntervals: [
      { min: -104, max: -83 }, // Mexico, Honduras
      { min: -79, max: -60 }, // Jamica, Dominic Republic, Islands
      { min: -16, max: 4 }, // Senegal, Guinea
      { min: 4, max: 22 }, // Niger, north Nigeria, Chad
      { min: 22, max: 51 }, // Sudan, Yemen Ethiopia, Yemen
      { min: 72, max: 88 }, // India
      { min: 94, max: 109 }, // Myanmar, Thailand, Vietname
      { min: 118, max: 125 }, // Philippines
    ],
  },
  {
    max: 10,
    min: 0,
    lngIntervals: [
      { min: -86, max: -72 }, // middle america, ecuador, colombia
      { min: -72, max: -60 }, // colombia, venezuale
      { min: -60, max: -50 }, // surina, Guyana, brazil
      { min: -11, max: 8 }, // liberia, ivory coast, benin, togo, nigeria, more
      { min: 8, max: 30 }, // south sudan, cameroon, CAF
      { min: 30, max: 46 }, // uganda, kenya, somalia, ethiopia
      { min: 75, max: 82 }, // Sri lanka, india
      { min: 94, max: 110 }, // Malasia, indonesia, brunei, vietnam, thailand
      { min: 120, max: 126 }, // Philippines
    ],
  },
  {
    max: 0,
    min: -10,
    lngIntervals: [
      { min: -81, max: -67 }, // ecuador, peru, brazil
      { min: -64, max: -35 }, // brazil
      { min: 9, max: 30 }, // Equatorial guinea, gabon, DRC, north Angola
      { min: 30, max: 42 }, // Kenya, Tanzania
      { min: 100, max: 116 }, // indonesia
      { min: 116, max: 146 }, // Indonesia, Papua new Guinea
    ],
  },
  {
    max: -10,
    min: -20,
    lngIntervals: [
      { min: -78, max: -60 }, // Peru, Bolivia
      { min: -60, max: -36 }, // Brazil, Paraguay
      { min: 11, max: 25 }, // Namibia, Angola, Zambia
      { min: 25, max: 40 }, // Mozamique, Zimbabwe, Malawi
      { min: 40, max: 49 }, // Madagascar
      { min: 124, max: 146 }, // North Australia
    ],
  },
  {
    max: -20,
    min: -30,
    lngIntervals: [
      { min: -71, max: -63 }, // Argentina, Chile
      { min: -63, max: -39 }, // Argentina, Brazil
      { min: 14, max: 34 }, // Namimbia, South Africa, Botswana, Eswatini
      { min: 43, max: 47 }, // Madagascar
      { min: 113, max: 135 }, // east Australia
      { min: 135, max: 153 }, // West Australia
    ],
  },
  {
    max: -30,
    min: -40,
    lngIntervals: [
      { min: -73.8, max: -50 }, // chile, argentina, uruguay
      { min: 17.5, max: 31 }, // South africa
      { min: 115, max: 136 }, // south west australia
      { min: 136, max: 152 }, // south east australia
      { min: 172, max: 178 }, // North island New Zealand
    ],
  },
  {
    max: -40,
    min: -50,
    lngIntervals: [
      { min: -75, max: -70 }, // chile argentina
      { min: -65, max: -62 }, // chile argentina
      { min: 144, max: 148 }, // Tasmania
      { min: 166, max: 177 }, // New Zealand
    ],
  },
  // Not going more south since it till cause an inbalance because -50, -60 will be only chile argentina and it will appear 1/13 of the time
];

module.exports = {
  worldMapSplits,
};
