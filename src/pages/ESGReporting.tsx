{/* ================= Executive KPI Section ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

<div className="bg-white rounded-xl shadow-lg p-5">
<h3 className="text-gray-500 text-sm">Fresh Water Withdrawal</h3>
<p className="text-3xl font-bold text-blue-600">
{dashboard.freshWater.toLocaleString()} m³
</p>
<div className="mt-2 h-2 bg-gray-200 rounded-full">
<div
className="h-2 rounded-full bg-blue-600"
style={{width:"72%"}}
/>
</div>
</div>

<div className="bg-white rounded-xl shadow-lg p-5">
<h3 className="text-gray-500 text-sm">Water Recycled</h3>
<p className="text-3xl font-bold text-green-600">
{dashboard.recycle.toLocaleString()} m³
</p>
<div className="mt-2 h-2 bg-gray-200 rounded-full">
<div
className="h-2 rounded-full bg-green-600"
style={{width:"64%"}}
/>
</div>
</div>

<div className="bg-white rounded-xl shadow-lg p-5">
<h3 className="text-gray-500 text-sm">Water Intensity</h3>
<p className="text-3xl font-bold text-indigo-600">
{dashboard.intensity}
</p>
<p className="text-sm text-gray-500">
m³ / Ton Product
</p>
</div>

<div className="bg-white rounded-xl shadow-lg p-5">
<h3 className="text-gray-500 text-sm">Water Neutrality</h3>
<p className="text-3xl font-bold text-purple-700">
{dashboard.neutrality}%
</p>

<div className="mt-3">
<div className="w-full h-3 rounded-full bg-gray-200">
<div
className="bg-purple-700 h-3 rounded-full"
style={{width:`${dashboard.neutrality}%`}}
></div>
</div>
</div>

</div>

</div>

{/* ================= ESG Score Cards ================= */}

<div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">

{[
["BRSR",92],
["CDP",88],
["GRI 303",95],
["AWS",81],
["ISO46001",90]

].map((item,index)=>(

<div
key={index}
className="bg-gradient-to-br from-blue-50 to-white shadow rounded-xl p-6 text-center">

<h3 className="font-semibold">
{item[0]}
</h3>

<p className="text-4xl font-bold mt-4 text-blue-700">
{item[1]}%
</p>

<div className="mt-4 bg-gray-200 h-2 rounded-full">

<div
className="bg-green-600 h-2 rounded-full"
style={{width:`${item[1]}%`}}
></div>

</div>

</div>

))}

</div>

{/* ================= AI Recommendation ================= */}

<div className="bg-gradient-to-r from-cyan-700 to-blue-900 rounded-xl p-8 mt-10 text-white">

<h2 className="text-2xl font-bold">
AI Sustainability Recommendation
</h2>

<p className="mt-4 leading-8">

Freshwater dependency has reduced by
<strong>18.4%</strong> compared to last year.

Cooling Tower optimization alone has saved

<strong> 1.2 Million Litres</strong>

of water this month.

Predicted annual savings:

₹58.4 Lakhs.

Recommended next action:

Increase recycle water utilization from
64% to 75%.

</p>

</div>