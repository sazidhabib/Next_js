const fs=require("fs");const p="C:/Users/sazid/OneDrive/Documents/GitHub/Next_js/nextidea-javascript/app/components/PackagesSection.jsx";let c=fs.readFileSync(p,"utf8");c=c.replace(/<div
s+key={pkg.name}
s+className={relative");c=c.replace(/</div>
s+))}
s+</div>

s+<p className="text-center text-zinc-500 text-sm mt-8">/,"</motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="text-center text-zinc-500 text-sm mt-8">");c=c.replace(/*Media payments are paid in advance
s+</p>/,"*Media payments are paid in advance
        </motion.p>");fs.writeFileSync(p,c);console.log("PackagesSection fixed");