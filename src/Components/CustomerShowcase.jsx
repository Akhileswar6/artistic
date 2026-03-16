export default function CustomerShowcase() {

const customers = [
{
id:1,
image:"/customers/customer1.jpg",
name:"Rahul",
review:"Amazing portrait! Looks exactly like the photo."
},
{
id:2,
image:"/customers/customer2.jpg",
name:"Priya",
review:"Beautiful artwork and fast delivery."
}
]

return (

<section className="py-20">

<h2 className="text-4xl text-center font-serif mb-12">
Customer Showcase
</h2>

<div className="grid md:grid-cols-3 gap-8">

{customers.map(c => (

<div key={c.id} className="bg-white rounded-xl shadow-lg overflow-hidden">

<img src={c.image} className="h-[260px] w-full object-cover"/>

<div className="p-5">

<h3 className="font-semibold">{c.name}</h3>

<p className="text-gray-500 text-sm mt-2">
{c.review}
</p>

</div>

</div>

))}

</div>

</section>

)

}